export default function Input({ className = "", ...props }) {
    return (
        <input
            className={`bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            {...props}
        />
    );
}
