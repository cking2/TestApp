Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        Ext.create('Rally.data.WsapiDataStore', {
    		model: 'testcase',
			autoLoad: true,
			listeners: {
				load: this._onDataLoaded,
				scope: this
			}
		});
    },
            
	_onDataLoaded: function(store, data) {
		
		var totalTestCases = data.length;
		
		var pass = 0;
		var fail = 0;
		var blocked = 0;
		var error = 0;
		var inconclusive = 0;
		var notRan = 0;
		
		var automated = 0;
		var manual = 0;
		
		Ext.Array.each(data, function(record) {
			switch(record.get('LastVerdict')) {
				case 'Pass':
					pass++;
					break;
				case 'Fail':
					fail++;
					break;
				case 'Blocked':
					blocked++;
					break;
				case 'Error':
					error++;
					break;
				case 'Inconclusive':
					inconclusive++;
					break;
				default: 
					notRan++;
					break;
			}
			
			switch(record.get('Method')) {
				case 'Automated':
					automated++;
					break;
				case 'Manual':
					manual++;
					break;
			}
		});
		
		var records = [];
		
		records.push({
			name: 'Total TestCases',
			value: totalTestCases,
            percent: '100%'
		});
		records.push({
			name: 'Passing',
			value: pass,
            percent: ((pass/totalTestCases)*100).toFixed(0)+'%'
		});
		records.push({
			name: 'Failed',
			value: fail,
            percent: ((fail/totalTestCases)*100).toFixed(0)+'%'
		});
		records.push({
			name: 'Blocked',
			value: blocked,
            percent: ((blocked/totalTestCases)*100).toFixed(0)+'%'
		});
		records.push({
			name: 'Error',
			value: error,
            percent: ((error/totalTestCases)*100).toFixed(0)+'%'
		});
		records.push({
			name: 'Inconclusive',
			value: inconclusive,
            percent: ((inconclusive/totalTestCases)*100).toFixed(0)+'%'
		});
		records.push({
			name: 'Not Ran',
			value: notRan,
            percent: ((notRan/totalTestCases)*100).toFixed(0)+'%'
		});
		
		this.add({
			xtype: 'rallygrid',
			store: Ext.create('Rally.data.custom.Store', {
				data: records
			}),
			showPagingToolbar: false,
			columnCfgs: [
				{
					text: 'Name', dataIndex: 'name'
				},
				{
					text: 'Value', dataIndex: 'value'
				},
                {
                    text: 'Percent', dataIndex: 'percent', flex: 1
                }
			]
		});
	}
 
});