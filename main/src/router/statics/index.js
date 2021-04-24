const _import = require('../import-' + process.env.NODE_ENV)

export default [
	{ path: '/stock-add', component: _import('statics/stock/add'), name: 'stock-add', meta: { title: '添加库存', isTab: true } },
	{ path: '/customer-add', component: _import('statics/customer/add'), name: 'customer-add', meta: { title: '添加客户', isTab: true } },
	{ path: '/order-detail', component: _import('statics/order/detail'), name: 'order-detail', meta: { title: '订单信息', isTab: true } },
	{ path: '/order-review', component: _import('statics/order/review'), name: 'order-review', meta: { title: '客户回访', isTab: true } },
	{ path: '/follow-list', component: _import('statics/customer/followList'), name: 'follow-list', meta: { title: '跟进小记', isTab: true } },
	{ path: '/follow-add', component: _import('statics/customer/followAdd'), name: 'follow-add', meta: { title: '添加跟进记录', isTab: true } },
	{ path: '/statistics-add', component: _import('statics/finance/statisticsAdd'), name: 'statistics-add', meta: { title: '新增报表', isTab: true } },
]