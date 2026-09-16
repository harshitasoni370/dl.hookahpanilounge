import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'node:https'

function gamesProxy() {
	return {
		name: 'games-api-proxy',
		configureServer(server) {
			server.middlewares.use('/api/games', (req, res) => {
				const params = new URL(req.url, 'http://localhost').searchParams
				const type = params.get('type')
				const endpoint = type === 'playstation'
					? 'Playstation/Playstationgamelist'
					: type === 'board-games'
						? 'BoardGame/Boardgamelist'
						: null
				const companyId = params.get('companyId')
				const branchId = params.get('branchId')
				if (!endpoint || !companyId || !branchId) {
					res.statusCode = 400
					res.end(JSON.stringify({ error: 'Invalid game API request' }))
					return
				}
				const body = JSON.stringify({ companyId, branchId })
				const upstream = https.request(`https://fumesandflavoursapi.cylsysuat.com/api/${endpoint}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
				}, (response) => {
					let output = ''
					response.on('data', (chunk) => { output += chunk })
					response.on('end', () => {
						res.statusCode = response.statusCode || 502
						res.setHeader('Content-Type', 'application/json')
						res.end(output)
					})
				})
				upstream.on('error', (error) => {
					res.statusCode = 502
					res.end(JSON.stringify({ error: error.message }))
				})
				upstream.write(body)
				upstream.end()
			})
		},
	}
}

function customMomentsProxy() {
	return {
		name: 'custom-moments-api-proxy',
		configureServer(server) {
			server.middlewares.use('/api/custom-moments', (req, res) => {
				const params = new URL(req.url, 'http://localhost').searchParams
				const companyId = params.get('companyId')
				const branchId = params.get('branchId')
				const search = params.get('search') || ''
				const typeId = params.get('typeId')
				const tableSessionId = req.headers['table-session-id']
				if (!companyId || !branchId || !typeId || !tableSessionId) {
					res.statusCode = 400
					res.end(JSON.stringify({ error: 'Invalid custom moments API request' }))
					return
				}
				const body = JSON.stringify({ companyId, branchId, search, typeId })
				const upstream = https.request('https://fumesandflavoursapi.cylsysuat.com/api/CustomMoment/GetCustomMoments', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': Buffer.byteLength(body),
						'Table-Session-Id': tableSessionId,
					},
				}, (response) => {
					let output = ''
					response.on('data', (chunk) => { output += chunk })
					response.on('end', () => {
						res.statusCode = response.statusCode || 502
						res.setHeader('Content-Type', 'application/json')
						res.end(output)
					})
				})
				upstream.on('error', (error) => {
					res.statusCode = 502
					res.end(JSON.stringify({ error: error.message }))
				})
				upstream.write(body)
				upstream.end()
			})
		},
	}
}

function celebrationPackagesProxy() {
	return {
		name: 'celebration-packages-api-proxy',
		configureServer(server) {
			server.middlewares.use('/api/celebration-packages', (req, res) => {
				const params = new URL(req.url, 'http://localhost').searchParams
				const type = params.get('type')
				const endpoint = type === 'birthday'
					? 'Birthday/GetBirthdayPageData'
					: type === 'corporate'
						? 'Corporate/GetCorporatePageData'
						: null
				const companyId = params.get('companyId')
				const branchId = params.get('branchId')
				const moduleId = params.get('moduleId') || (type === 'birthday'
					? '02861404-4450-4d04-8461-679f3e8e09e3'
					: '02ea8929-ad23-47a0-b416-db1d0f33ec46')
				if (!endpoint || !companyId || !branchId) {
					res.statusCode = 400
					res.end(JSON.stringify({ error: 'Invalid celebration packages API request' }))
					return
				}
				const upstreamUrl = `https://fumesandflavoursapi.cylsysuat.com/api/${endpoint}?${new URLSearchParams({ companyId, branchId, moduleId })}`
				https.get(upstreamUrl, (response) => {
					let output = ''
					response.on('data', (chunk) => { output += chunk })
					response.on('end', () => {
						res.statusCode = response.statusCode || 502
						res.setHeader('Content-Type', 'application/json')
						res.end(output)
					})
				}).on('error', (error) => {
					res.statusCode = 502
					res.end(JSON.stringify({ error: error.message }))
				})
			})
		},
	}
}

function membershipProxy() {
	return {
		name: 'membership-api-proxy',
		configureServer(server) {
			server.middlewares.use('/api/membership', (req, res) => {
				const params = new URL(req.url, 'http://localhost').searchParams
				const companyId = params.get('companyId')
				const branchId = params.get('branchId')
				const moduleId = params.get('moduleId') || 'b38fa611-ea6c-4414-9398-fbe6ca1d314c'
				if (!companyId || !branchId) {
					res.statusCode = 400
					res.end(JSON.stringify({ error: 'Invalid membership API request' }))
					return
				}
				const upstreamUrl = `https://fumesandflavoursapi.cylsysuat.com/api/Membership/GetMembershipPageData?${new URLSearchParams({ companyId, branchId, moduleId })}`
				https.get(upstreamUrl, (response) => {
					let output = ''
					response.on('data', (chunk) => { output += chunk })
					response.on('end', () => {
						res.statusCode = response.statusCode || 502
						res.setHeader('Content-Type', 'application/json')
						res.end(output)
					})
				}).on('error', (error) => {
					res.statusCode = 502
					res.end(JSON.stringify({ error: error.message }))
				})
			})
		},
	}
}

export default defineConfig({ plugins: [react(), gamesProxy(), customMomentsProxy(), celebrationPackagesProxy(), membershipProxy()] })
