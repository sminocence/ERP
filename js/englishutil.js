function toAccoutnEnglish(type){
    switch (type){
        case '资产':
            return 'Asset';
        case '负债和所有者权益':
            return ' Liabilities And Owner\'s Equity';
        case '期初数':
            return 'Beginning Balance';
        case '期末数':
            return 'Closing Balance';
        case '流动资产：':
            return 'Current Assets';
        case '负债：':
            return 'Liabilities';
        case '现金':
            return 'Cash';
        case '应收账款':
            return 'Accounts Receivable';
        case '在制品':
            return 'Work-In-Process';
        case '成品':
            return 'Finished Product';
        case '原料':
            return 'Material';
        case '长期负债':
            return 'Long-Term Debt';
        case '短期负债':
            return 'Short-Term Debt';
        case '应付账款':
            return 'Account Payable';
        case '应交税金':
            return 'Tax Payable';
        case '一年内到期的长期负债':
            return 'Current Maturities Of Long-Term Debt';
        case '流动资产合计':
            return 'Total Current Assets';
        case '负债合计':
            return 'Total Liabilities';
        case '固定资产：':
            return 'Fixed Asset';
        case '所有者权益：':
            return 'Owners Equity';
        case '土地和建筑':
            return 'Land & Buildings';
        case '机器与设备':
            return 'Plant & Machinery';
        case '在建工程':
            return 'Project Under Construction';
        case '累计折旧':
            return 'Accumulated Depreciation';
        case '固定资产合计':
            return 'Total Fixed Assets';
        case '股东资本':
            return 'Equity Capital';
        case '利润留存':
            return 'Profit Retention';
        case '净利润':
            return 'Net Profit';
        case '所有者权益合计':
            return 'Total Owners\' Equity';
        case '负债和所有者权益总计':
            return 'total amount of liability items and owner\'s equities';
<<<<<<< HEAD
<<<<<<< HEAD
=======
        case '资产总计':
            return 'Total Assets';
>>>>>>> origin/english
=======
        case '资产总计':
            return 'Total Assets';
>>>>>>> d68c673aab6863149f47c1fdc1753b5030acc173
    }
    return type;
}

function toProfitSheetEnglish(type){
    switch (type){
        case '主营业务收入':
            return 'Main Business Revenue';
        case '减：主营业务成本':
            return 'Minus : Main Business Cost';
        case '减：主营业务税金':
            return 'Minus : Main Business\'s Taxes';
        case '主营业务利润':
            return 'Main Business Profit';
        case '减：营业费用':
            return 'Minus : Business Expenses';
        case '减：管理费用':
            return 'Minus : Administration Expense';
        case '减：财务费用':
            return 'Minus : Financial Expense';
        case '营业利润':
            return 'Operating Profit';
        case '其他业务收入':
            return 'Other Business Income';
        case '减：其他业务支出':
            return 'Minus : Other Business Expense';
        case '利润总额':
            return 'Total Profit';
        case '所得税':
            return 'Income Tax';
        case '净利润':
            return 'Net Profit';
        case '项目':
            return 'Project';
        case '数值':
            return 'Account';
    }
    return type;
}