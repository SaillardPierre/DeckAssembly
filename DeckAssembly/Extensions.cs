namespace DeckAssembly
{
    public static class Extensions 
    {
        public static void InsertOrAppend<T>(this IList<T> values, T item, int? targetIndex)
        {
            if (targetIndex.HasValue)
            {
                values.Insert(targetIndex.Value, item);
            }
            else values.Add(item);
        }

        public static void PutBackAtIndex<T>(this IList<T> values, T item, int? targetIndex)
        {
            values.Remove(item);
            values.InsertOrAppend(item, targetIndex);
        }

        public static T RemoveAtAndReturn<T>(this IList<T> list, int index)
        {
            if (index < 0 || index >= list.Count)
            {
                throw new ArgumentOutOfRangeException(nameof(index));
            }

            T item = list[index];
            list.RemoveAt(index);
            return item;
        }
    }
}
