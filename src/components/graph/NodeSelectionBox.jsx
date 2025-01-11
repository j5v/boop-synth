import './NodeSelectionBox.css'

function NodeSelectionBox({ rectCoords, view }) {

  if (rectCoords.x1 && rectCoords.x2 && rectCoords.y1 && rectCoords.y2) {

    const x1 = Math.min(rectCoords.x1, rectCoords.x2);
    const x2 = Math.max(rectCoords.x1, rectCoords.x2);

    const y1 = Math.min(rectCoords.y1, rectCoords.y2);
    const y2 = Math.max(rectCoords.y1, rectCoords.y2);

    return (
      <rect
        className="selection-box"
        x={(x1 - view.panX || 0 ) / view.scale}
        y={(y1 - view.panY || 0 ) / view.scale}
        width={(x2 - x1 ) / view.scale }
        height={(y2 - y1 ) / view.scale }
      />
    )
  } else {
    return <></>
  }

}

export default NodeSelectionBox
