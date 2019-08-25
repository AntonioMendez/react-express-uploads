import React from 'react'
import { Button } from '@material-ui/core'
import CloudDownload from '@material-ui/icons/CloudDownload'
import './App.css'

class App extends React.Component {
	onClick = () => {
		let options = {
			method: 'POST',
			body: JSON.stringify({ requestId: '53', bundle: false }),
			headers: {
				'Content-Type': 'application/json'
			}
		}

		fetch('/getDownloadURL', options)
			.then(response => response.json())
			.then(res => {
				console.log(res)
				if (res.success) window.location.href = res.url
				else alert(res.error)
			})
	}

	render() {
		return (
			<div id='main-container'>
				<Button variant='contained' color='primary' className='download-button' onClick={this.onClick}>
					<CloudDownload />
					Download file
				</Button>
			</div>
		)
	}
}

export default App
