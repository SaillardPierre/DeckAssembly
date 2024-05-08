async function dragAndDrop(className, restrictionSelector, blazorComponent, dragManager) {
    interact(className).draggable({
        intertia: true,
        listeners: {
            start(event) {
                const index = parseInt(event.target.dataset.index);
                blazorComponent.invokeMethodAsync('OnDragStartAsync', index);
            },
            end(event) {
                if (!event.relatedTarget) {
                    event.target.style.transform = '';
                }
                blazorComponent.invokeMethodAsync('OnDragEndAsync');
            },
            move(event) {
                // Récupération de la position prédécente éventuelle
                var initialTransform = event.target.style.transform || "translate(0px, 0px)";
                const response = dragManager.invokeMethod('OnCardMove', event.dx, event.dy, initialTransform);
                event.target.style.transform = response.result;
            },
        },
        modifiers: [            
            //interact.modifiers.restrictRect({
            //    restriction: restrictionSelector,
            //    endOnly: true
            //})
        ]
    })
};

function dropZone(dropTarget, blazorComponent) {
    interact(dropTarget)
        .dropzone({
            ondragenter: function (event) {
                // Appelé quand un draggable rentre dans la zone, la dropzone est bien récupérée ici                
                var draggableElement = event.relatedTarget
                var dropzoneElement = event.target

                dropzoneElement.classList.add('drop-target')
                draggableElement.classList.add('can-drop')
                console.log(draggableElement.id + ' was moved into ' + dropzoneElement.id);
            },
            ondrop: function (event) {
                console.log(event.relatedTarget.id + ' was dropped into ' + event.target.id);

                //if (event.relatedTarget)

                // Si on repose dans la même div que la ou on vient de le prendre,
                // ("A la main" ou généré par la restriction)
                if (event.relatedTarget.parentElement == event.target) {
                    // Peut etre variabiliser ceci
                    const shouldPutBackInPlace = false;
                    // On enlève la transformation pour le draggable reprenne sa place                
                    if (shouldPutBackInPlace) {
                        event.relatedTarget.style.transform = '';
                    }
                    //event.stopPropagation();
                    //return;
                }

                // TODO : Changer la facon dont on passe la réf à runtime .NET pour gérer le passage d'une liste à l'autre (entre autres)
                //const item = { id: parseInt(event.relatedTarget.dataset.identifier), name: event.relatedTarget.dataset.displayName }
                //const index = parseInt(event.relatedTarget.dataset.index);
                //blazorComponent.invokeMethodAsync('HandleDrop', index);
            }
        })
        .on('dropactivate', function (event) {
            event.target.classList.add('drop-activated');
        })
};