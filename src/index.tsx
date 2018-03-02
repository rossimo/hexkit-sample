import { createStore, State, rotateTile } from 'hexkit'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { Dispatch } from 'redux'

interface In {
    state: State
}

interface Out {
    rotateTile: () => void
}

class PluginComponent extends React.Component<In & Out> {
    render() {
        let { state, rotateTile } = this.props;

        return <div>
            The first tile's URI is {state.map.layers[0].tiles[0].source}
            <br /><br />
            <button onClick={() => rotateTile()}>Rotate</button>
        </div>
    }
}

let Plugin = connect<In, Out>(
    (state: State) => ({
        state
    }),
    (dispatch: Dispatch<State>) => ({
        rotateTile: () => dispatch(rotateTile({ x: 0, y: 0 }))
    })
)(PluginComponent)

window.onload = () => {
    let store = createStore()

    ReactDOM.render(
        <Provider store={store}><Plugin /></Provider>,
        document.getElementById('plugin'))
}