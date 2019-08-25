var path = require('path')
var moment = require('moment')
var fs = require('fs')
var jsZip = require('jszip')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()

const DOWNLOAD_PATHS = ['/uploads/prueba.txt', '/uploads/prueba1.txt', '/uploads/prueba2.txt', '/uploads/prueba3.txt']

app.use(bodyParser.json())
app.use((req, res, next) => {
	req.user = 'AMENDEZ'
	next()
})

app.use('/download-file/*', (req, res, next) => {
	if (req.user) {
		const params = req.params[0].split('/')
		let rootDir = path.join(__dirname, '/uploads')
		if (params[0] === 'bundle') rootDir = rootDir + '/tmp'
		rootDir = rootDir + `/${params.pop()}`

		res.download(rootDir, error => {
			if (params[0] === 'bundle') fs.unlinkSync(rootDir)
			console.log('Download finished')
		})
	} else res.status(500).end()
})

// This request should be made via GraphQL
app.post('/getDownloadURL', async (req, res) => {
	if (req.user) {
		if (req.body.bundle) {
			try {
				let zip = jsZip()
				DOWNLOAD_PATHS.forEach(filePath =>
					zip.file(filePath.match(/[^\/]+$/)[0], fs.readFileSync(path.join(__dirname, filePath)))
				)

				const zipName = moment().format('YYYYMMDDHHmmmss')
				let zipContent = await zip.generateAsync({ type: 'nodebuffer' })
				fs.writeFileSync(`${__dirname}/uploads/tmp/${zipName}.zip`, zipContent)

				res.json({
					success: true,
					url: `http://localhost:8000/download-file/bundle/asdjaslkjdaslkdjas/alksjdlaksjdas/${zipName}.zip`
				})
			} catch (error) {
				console.log(error)
				res.json({ success: false, error: 'Ha ocurrido un problema al obtener la URL' })
			}
		} else {
			res.json({
				success: true,
				url: `http://localhost:8000/download-file/single/asdjaslkjdaslkdjas/alksjdlaksjdas/prueba.txt`
			})
		}
	} else res.json({ success: false, error: 'Ha ocurrido un problema al obtener la URL' })
})

app.listen(8000, () => console.log('Backend running on port: 8000'))
