export const calculatePerMinRate = (option) => {
    if (option.rate_per_min) {
        return option.rate_per_min.toFixed(2);
    }
    if (option.included_hours && option.total_price) {
        const totalMins = option.included_hours * 60;
        return (option.total_price / totalMins).toFixed(2);
    }
    return null;
};

export const enrichOptionsWithRates = (options) => {
    return options.map((option) => {
        return {
            ...option,
            rate_per_min: calculatePerMinRate(option),
        };
    });
};