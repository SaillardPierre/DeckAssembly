using Microsoft.JSInterop;
using System.Globalization;
using System.Text.RegularExpressions;
using static DeckAssembly.Components.PickPoolComponent;

namespace DeckAssembly;

public class DragManager
{
    [JSInvokable(nameof(OnCardMove))]
    public async ValueTask<string> OnCardMove(float dx, float dy, string initialTransform)
    {
        float x = 0;
        float y = 0;

        if (!string.IsNullOrWhiteSpace(initialTransform))
        {
            string pattern = @"translate\(([^,]+)px,\s*([^,]+)px\)";

            Match match = Regex.Match(initialTransform, pattern);

            if (match.Success)
            {
                x = float.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture);
                y = float.Parse(match.Groups[2].Value, CultureInfo.InvariantCulture);
            }
        }

        x += dx;
        y += dy;

        return $"translate({x}px, {y}px)";
    }

    public static int GetFutureIndex(UpperTopCoordinate selfCoordinates, IEnumerable<UpperTopCoordinate> coordinates)
        {
            // Si le pointeur a des coordonnées superieures en x ou y, on est + vers la droite
            int index = 0;
            foreach (UpperTopCoordinate coord in coordinates)
            {
                if (coord.x < selfCoordinates.x) index++;
            }
            return index;
        }

   
}
