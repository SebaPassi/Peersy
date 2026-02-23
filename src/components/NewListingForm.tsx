'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Categories available
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

// Condition status available
const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like new' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

// Client component
export default function NewListingForm({ userId }: { userId: string }) {
  // Listing states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState(CONDITIONS[0].value);
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Extra states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect that cleans browser memory
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Function that controls the files
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected) return;

    // Array with just the new files
    const newFiles = Array.from(selected).slice(0, 5 - files.length);

    // Array with all the files
    const updatedFiles = [...files, ...newFiles].slice(0, 5);

    // Updates the Files state to be these new array with all the files
    setFiles(updatedFiles);

    // Temporary browser urls of the images
    // URL: createObjectURL() -> creates a temporary local URL pointing to the file stored in memory.
    // At this point the file is just in browser's memory
    const newPreviews = updatedFiles.map((f) => URL.createObjectURL(f));
    setPreviews(newPreviews);
  }

  // Funtion to remove an image
  function removeImage(index: number) {
    // Filter by image index
    const updatedFiles = files.filter((_, i) => i !== index);

    // Removes that image from the states Files and Previews
    setFiles(updatedFiles);
    setPreviews(updatedFiles.map((f) => URL.createObjectURL(f)));
  }

  // Function that handles submission of the form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validation of price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Please enter a valid price.');
      return;
    }

    setLoading(true);

    // Supabase
    const supabase = createClient();

    const imageUrls: string[] = [];

    // Upload images, get their public url and store it in "imageUrls" variable
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

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

      imageUrls.push(publicUrlData.publicUrl);
    }

    // Add listing to database
    const { data, error: insertError } = await supabase
      .from('listings')
      .insert({
        seller_id: userId,
        title,
        description: description || null,
        price: parsedPrice,
        category,
        condition,
        images: imageUrls,
        location: location || null,
        status: 'active',
      })
      .select('id')
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    // Redirect to the show page of the new listing added
    window.location.href = `/dashboard/listings/${data.id}`;
  }

  // Render component
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-white mb-2"
        >
          Title
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
          Price (£)
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

      {/* Category & Condition row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-white mb-2"
          >
            Category
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
            Condition
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
          Photos (up to 5)
        </label>
        {previews.length > 0 && (
          <div className="flex gap-3 mb-3 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20">
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-20 h-20 rounded-lg object-cover border border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {files.length < 5 && (
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
        <p className="text-gray-500 text-xs mt-1">
          {files.length}/5 images selected
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-purple-600 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create listing'}
      </button>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
          {error}
        </p>
      )}
    </form>
  );
}
