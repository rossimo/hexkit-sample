import 'bootstrap/dist/css/bootstrap.css'

import {
    createStore, State, rotateTile, selectTile, Tools,
    listenMouse, TileCoord, setTool, Map, flipTile, Tile, ITileInfo
} from 'hexkit'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as  jsonFormat from 'json-format'
import { Button, Row, Alert, Container, Col } from 'reactstrap'
import { connect, Provider } from 'react-redux'
import { Dispatch } from 'redux'
import * as _ from 'lodash'
import { last } from 'lodash'
import { ipcRenderer as ipc } from 'electron'

const INSPECT_TOOL = Tools.Info

const indexToCoordinate = (index: number, map: Map): TileCoord =>
    index > -1
        ? {
            x: index % map.width,
            y: Math.floor(index / map.width)
        }
        : null

interface In {
    appState: State
}

interface Out {
    startInspecting: () => void
    selectTile: (coordinate: TileCoord) => void
    rotateTile: (coord: TileCoord) => void
    flipTile: (coord: TileCoord) => void
}

let PluginComponent = ({ appState, startInspecting, rotateTile, flipTile }: In & Out) => {
    let inspecting = appState.tool == INSPECT_TOOL
    let tile: Tile
    let coordinate: TileCoord
    if (inspecting) {
        let index = _.findIndex(appState.map.infoLayer, info => info.selected)
        coordinate = indexToCoordinate(index, appState.map)
        tile = appState.map.layers[0].tiles[index]
    }

    return <Container fluid={true} style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Row>
            <Col style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    color={inspecting ? 'primary' : 'secondary'}
                    onClick={() => startInspecting()}>
                    {inspecting ? 'Inspecting' : 'Click To Inspect'}
                </Button>
            </Col>
        </Row>
        {coordinate && <Row>
            <Col style={{ paddingTop: 10 }}>
                <Alert color="secondary">
                    <pre style={{ margin: 0 }}><code>
                        {jsonFormat(tile, {
                            type: 'space',
                            size: 4
                        })}
                    </code></pre>
                </Alert>
            </Col>
        </Row>}
        {coordinate && <Row>
            <Col style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => rotateTile(coordinate)}>
                    Rotate
                </Button>
                &nbsp;
                <Button onClick={() => flipTile(coordinate)}>
                    Flip
                </Button>
            </Col>
        </Row>}
    </Container>
}

let Plugin = connect<In, Out>(
    (state: State) => ({
        appState: state
    }),
    (dispatch: Dispatch<State>) => ({
        selectTile: (coordinate: TileCoord) => dispatch(selectTile(coordinate)),
        startInspecting: () => dispatch(setTool(INSPECT_TOOL)),
        rotateTile: (coord: TileCoord) => dispatch(rotateTile(coord)),
        flipTile: (coord: TileCoord) => dispatch(flipTile(coord))
    })
)(PluginComponent)

window.onload = () => {
    let store = createStore()

    ReactDOM.render(
        <Provider store={store}><Plugin /></Provider>,
        document.getElementById('plugin'))
}