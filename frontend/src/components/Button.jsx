const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg",
    ghost:   "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
    danger:  "text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400",
};

export default function Button({ variant = "primary", className = "", ...props }) {
    return (
        <button
            className={`text-sm transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
            {...props}
        />
    );
}
