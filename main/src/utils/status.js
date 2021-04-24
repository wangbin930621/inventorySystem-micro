export function status(t) {
    const arr = {
        0: '禁用',
        1: '启用'
    }
    return arr[t]
}

export function orderStatus(t) {
    const arr = {
        1: '待付款',
        2: '待量体',
        3: '待店长审核',
        4: '审核不通过',
        5: '待提交',
        6: '待录入三检',
        7: '待通知',
        8: '不通知客户',
        9: '待取货',
        10: '待回访',
        11: '已完成',
        12: '待发货',
        13: '修改中'
    }
    return arr[t]
}

export function returnStatus(t) {
    const arr = {
        1: '退货申请',
        2: '已退单',
        3: '拒绝退单',
    }
    return arr[t]
}
