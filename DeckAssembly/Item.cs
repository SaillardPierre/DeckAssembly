namespace DeckAssembly
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Status Status { get; set; }
        public Item(int id, string name)
        {
            Id = id;
            Name = name;
            Status = Status.Left;
        }
    }

    public enum Status
    {
        Left,
        Picked        
    }
}
