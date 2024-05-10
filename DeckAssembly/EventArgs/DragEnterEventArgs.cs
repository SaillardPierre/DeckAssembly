using DeckAssembly.Model;

namespace DeckAssembly.EventArgs;

public class DragEnterEventArgs
{
    public DragEnterSource DragEnterSource { get; set; }
    public int Index { get; set; }
    public List<Coordinate> Coordinates { get; set; }
}
public enum DragEnterSource
{
    Self,
    Target
}
