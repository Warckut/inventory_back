const ApiError = require('../error/ApiError')
// const purchasesService = require('../service/purchasesService')
const IssuesService = require('../service/IssuesService')

class IssuesController {

    async createPurchase(req, res, next) {
        try {
            const {issue} = req.body
            await IssuesService.createIssue(issue)
            return res.json({status: 'succes'})
        } catch (e) {
            next(e)
        }
    }

    async getPurchases(req, res, next) {
        try {
            const issues = await IssuesService.getIssues()
            return res.json(issues)
        } catch (e) {
            next(e)
        }
    }

    
}

module.exports =  new IssuesController()