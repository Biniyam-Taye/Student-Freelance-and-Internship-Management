import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { uploadAvatar } from '../../services/uploadService';

/**
 * Reusable avatar upload button.
 *
 * Props:
 *  - currentUrl: string | null   -> existing avatar URL
 *  - name: string                -> user's display name (for initials fallback)
 *  - onUploaded: (url) => void   -> called with the Cloudinary URL after upload
 */
export default function AvatarUpload({ currentUrl, name = '', onUploaded }) {
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(currentUrl || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Immediate local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setError(null);
        setLoading(true);

        try {
            const url = await uploadAvatar(file);
            setPreview(url);
            onUploaded(url);
        } catch {
            setError('Upload failed. Try again.');
            setPreview(currentUrl || null);
        } finally {
            setLoading(false);
        }
    };

    const initials = name?.trim()?.charAt(0)?.toUpperCase() || '?';

    return (
        <div className="relative w-24 h-24 mx-auto">
            {/* Avatar display */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-3xl font-bold">
                {preview ? (
                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span>{initials}</span>
                )}
            </div>

            {/* Upload trigger button */}
            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={loading}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
                title="Change photo"
            >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
            </button>

            {/* Hidden file input */}
            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFile}
            />

            {/* Error tooltip */}
            {error && (
                <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-red-500 whitespace-nowrap">
                    {error}
                </p>
            )}
        </div>
    );
}
