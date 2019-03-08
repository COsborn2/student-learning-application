import React from 'react'

const centerStyle = { top: 0, bottom: 0, left: 0, right: 0 }

function LandScape (props) {
    if ( props.isLandScape) {
        return <div style={centerStyle}> Please LandScape </div>
    }
    else {
        return <div></div>
    }
}

export default LandScape