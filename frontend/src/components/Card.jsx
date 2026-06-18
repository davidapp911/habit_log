export default function Card({ className = "", children }) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl ${className}`}>
            {children}
        </div>
    );
}
