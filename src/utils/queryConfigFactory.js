export const createQueryConfig = ({
    queryKey,
    queryFn,
    staleTime = Infinity,
    cacheTime = 3600000,
    keepPreviousData = true,
    enabled = true,
}) => ({
    queryKey,
    queryFn,
    staleTime,
    cacheTime,
    keepPreviousData,
    enabled,
});