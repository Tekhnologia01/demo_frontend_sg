const Spinner = ({ color = "#ba55d3", size = 56 }) => {
    return (
        <div className="flex justify-center items-center h-full">
            <div
                role="status"
                aria-label="loading"
                style={{ width: size, height: size }}
                className={`
          rounded-full
          animate-spin
          border-4 border-t-transparent
          border-[${color}]
          bg-transparent
        `}
            />
        </div>
    );
};

export default Spinner;