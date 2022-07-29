export function initializeDefaultValue<T>(loadedValues: T, defaultValues: T): T {
    Object.entries(defaultValues).forEach(([key, value]) => {
        if (loadedValues[key] === undefined) {
            loadedValues[key] = value;
        }
    });
    return loadedValues;
}
