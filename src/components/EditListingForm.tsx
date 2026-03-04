'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Listing } from '@/types/database';

const CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Sports',
  'Kitchen',
  'Stationery',
  'Other',
];

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like new' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

export default function EditListingForm({ listing }: { listing: Listing }) {
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description ?? '');
  const [price, setPrice] = useState(String(listing.price));
  const [category, setCategory] = useState(listing.category);
  const [condition, setCondition] = useState(listing.condition);
  const [location, setLocation] = useState(listing.location ?? '');

  // Existing images already stored in Supabase
  const [existingImages, setExistingImages] = useState<string[]>(
    listing.images ?? [],
  );
  // Newly selected files (not yet uploaded)
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const totalImages = existingImages.length + newFiles.length;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected) return;

    const allowed = 5 - totalImages;
    const added = Array.from(selected).slice(0, allowed);
    const updatedFiles = [...newFiles, ...added];

    setNewFiles(updatedFiles);
    setNewPreviews(updatedFiles.map((f) => URL.createObjectURL(f)));
    e.target.value = '';
  }

  function removeExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewImage(index: number) {
    const updatedFiles = newFiles.filter((_, i) => i !== index);
    setNewFiles(updatedFiles);
    setNewPreviews(updatedFiles.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const errors: string[] = [];
    if (!title.trim()) errors.push('Title is required.');

    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice < 0)
      errors.push('Please enter a valid price.');

    if (!category) errors.push('Category is required.');
    if (!condition) errors.push('Condition is required.');
    if (totalImages === 0) errors.push('At least one photo is required.');

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Upload only the new files
    const uploadedUrls: string[] = [];
    for (const file of newFiles) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${listing.seller_id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, file);

      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    const allImages = [...existingImages, ...uploadedUrls];

    const { error: updateError } = await supabase
      .from('listings')
      .update({
        title,
        description: description || null,
        price: parsedPrice,
        category,
        condition,
        images: allImages,
        location: location || null,
      })
      .eq('id', listing.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    window.location.href = `/dashboard/listings/${listing.id}`;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-white mb-2"
        >
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Calculus Textbook 3rd Edition"
          required
          maxLength={120}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-white mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the item, including any defects or extras..."
          rows={4}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-white mb-2"
        >
          Price (£) <span className="text-red-400">*</span>
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          required
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Category & Condition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-white mb-2"
          >
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-white mb-2"
          >
            Condition <span className="text-red-400">*</span>
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-white mb-2"
        >
          Preferred meetup location
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Main Library, Students' Union"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Photos (at least 1, up to 5)
        </label>

        {(existingImages.length > 0 || newPreviews.length > 0) && (
          <div className="flex gap-3 mb-3 flex-wrap">
            {existingImages.map((src, i) => (
              <div key={`existing-${i}`} className="relative w-20 h-20">
                <img
                  src={src}
                  alt={`Image ${i + 1}`}
                  className="w-20 h-20 rounded-lg object-cover border border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {newPreviews.map((src, i) => (
              <div key={`new-${i}`} className="relative w-20 h-20">
                <img
                  src={src}
                  alt={`New ${i + 1}`}
                  className="w-20 h-20 rounded-lg object-cover border border-purple-500/50"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {totalImages < 5 && (
          <label className="inline-block cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
            Choose images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
        <p className="text-gray-500 text-xs mt-1">{totalImages}/5 images</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-purple-600 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50 hover:cursor-pointer"
      >
        {loading ? 'Saving...' : 'Save changes'}
      </button>

      {error && (
        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-24 rounded-xl border border-red-400/30 bg-red-400/10 p-5">
            <h3 className="text-sm font-semibold text-red-400 mb-2">
              Please fix the following
            </h3>
            <ul className="text-sm text-red-400 space-y-1 list-disc list-inside">
              {error.split('\n').map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </form>
  );
}
