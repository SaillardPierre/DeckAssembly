async function dragAndDrop(className, restrictionClassName, dotNetHelper) {
    interact(className).draggable({
        intertia: true,
        listeners: {
            start(event) {
                //console.log(event.type, event.target)
                const index = parseInt(event.target.dataset.index);
                dotNetHelper.invokeMethodAsync('OnDragStart', index);
            },
            end(event) {
                //console.log(event.type, event.target)
                dotNetHelper.invokeMethodAsync('OnDragEnd');
            },
            move(event) {
                // probleme ici, les positions sont partagées entre les cartes

                var initialTransform = event.target.style.transform;

                // Version C# ne fonctionne pas
                if (!initialTransform) {
                    initialTransform = 'translate(0px, 0px)';
                }

                dotNetHelper.invokeMethodAsync('OnMove', event.dx, event.dy, initialTransform)
                    .then(function (response) {
                        event.target.style.transform = response;
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });

                //var x = 0;
                //var y = 0;
                //if (initialTransform && initialTransform.trim() !== '') {
                //    var match = initialTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);

                //    if (match) {
                //        x = parseInt(match[1]);
                //        y = parseInt(match[2]);
                //    }
                //}
                //x += event.dx;
                //y += event.dy;
                //event.target.style.transform = `translate(${x}px, ${y}px)`;
            },
    }, modifiers: [
        interact.modifiers.restrictRect({
            restriction: restrictionClassName,
            endOnly: true
        })]
    })
};

function dropZone(dropTarget, dotNetHelper) {
    interact(dropTarget)
        .dropzone({
            ondrop: function (event) {
                //const droppedData = event.relatedTarget.interactable.getData('customData');
                //const targetZone = event.target.id;
                const item = { id: parseInt(event.relatedTarget.dataset.identifier), name: event.relatedTarget.dataset.displayName }

                console.log(event.relatedTarget.id + ' was dropped into ' + event.target.id);
                // TODO : Trouver les bonnes valeurs à mettre ici
                dotNetHelper.invokeMethodAsync('HandleDrop', item);
            }
        })
        .on('dropactivate', function (event) {
            event.target.classList.add('drop-activated');
        })
};