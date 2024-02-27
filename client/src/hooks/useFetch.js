import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";

export default function useFetch(api, params, extra) {
  const [getData, setData] = useState([]);
  // const [pagedData, setPagedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const data = useMemo(() => getData, [getData]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api(params, extra, { signal });
        if (!signal.aborted) {
          setData(res.data?.pins ? res?.data?.pins : res.data);
          setError(null);
        }
      } catch (error) {
        if (!signal.aborted) {
          setError(error?.response?.data?.error || error?.message);
          toast.error(error.response?.data || "An error occurred");
        }
        console.error(error);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [api, params, extra]);

  return { data, loading, error, setData};
}
