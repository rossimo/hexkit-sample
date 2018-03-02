import 'bootstrap/dist/css/bootstrap.css'

import { createStore, State, rotateTile, selectTile, listenMouse, TileCoord, setTool } from 'hexkit'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Button } from 'reactstrap'
import { connect, Provider } from 'react-redux'
import { Dispatch } from 'redux'
import { last } from 'lodash'
import { ipcRenderer as ipc } from 'electron'

const INSPECT_TOOL: string = 'INSPECT_TOOL'

interface In {
    state: State
}

interface Out {
    enableInspectTool: () => void
    selectTile: (coordinate: TileCoord) => void
}

class PluginComponent extends React.Component<In & Out> {
    private stopListener: Function

    componentWillMount() {
        let { state, selectTile } = this.props

        this.stopListener = listenMouse((event, args) => {
            let coordinate = last(args.coordinates)
            if (coordinate) selectTile(coordinate)
        })
    }

    componentWillUnmount() {
        this.stopListener()
    }

    render() {
        let { state, enableInspectTool } = this.props
        let inspecting = state.tool == INSPECT_TOOL

        return <div>
            <Button
                color={inspecting ? 'primary' : 'secondary'}
                onClick={() => enableInspectTool()}>
                Inspect Tool
            </Button>
            <br /><br />
            The first tile's URI is {state.map.layers[0].tiles[0].source}
        </div>
    }
}

let Plugin = connect<In, Out>(
    (state: State) => ({
        state
    }),
    (dispatch: Dispatch<State>) => ({
        selectTile: (coordinate: TileCoord) => dispatch(selectTile(coordinate)),
        enableInspectTool: () => dispatch(setTool(INSPECT_TOOL))
    })
)(PluginComponent)

window.onload = () => {
    let store = createStore()

    ReactDOM.render(
        <Provider store={store}><Plugin /></Provider>,
        document.getElementById('plugin'))
}