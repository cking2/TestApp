Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    layout: {
        type: 'vbox',
        align: 'stretch',
        style: 'margin: 0 auto;'
    },
    items: [
        {
            xtype: 'container',
            itemId: 'dataGridHolder',
            layout: 'auto'
        },
        {
            xtype: 'container',
            itemId: 'chartHolder',
            layout: 'auto'
        }
    ],
    
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
		
		this.down('#dataGridHolder').add({
			xtype: 'rallygrid',
			store: Ext.create('Rally.data.custom.Store', {
				data: records
			}),
            width: 400,
            style: 'margin: 5px auto;',
			showPagingToolbar: false,
			columnCfgs: [
				{
					text: 'Name', dataIndex: 'name'
				},
				{
					text: 'Count', dataIndex: 'value'
				},
                {
                    text: 'Percent', dataIndex: 'percent', flex: 1
                }
			]
		});
        
        this.down('#chartHolder').add({
            xtype: 'rallychart',
            height: 400,
            chartConfig: {
                chart: {
                    type: 'column'  
                },
                title: {
                    text: 'TestCase Counts',
                    align: 'center'
                },
                xAxis: [
                    {
                        categories: ['Pass', 'Fail', 'Blocked', 'Error', 'Inconclusive', 'Not Ran'],
                        title: {
                            text: 'Verdict'
                        }
                    }    
                ],
                yAxis: {
                    title: {
                        text: 'Count'
                    }
                },
                series: [
                    {
                        name: 'TestCase Counts',
                        data: [
                            {
                                color: '#89A54E',
                                y: pass
                            },
                            {
                                color: '#AA4643',
                                y: fail
                            },
                            {
                                color: '#DB843D',
                                y: blocked
                            },
                            {
                                color: '#A47D7C',
                                y: error
                            },
                            {
                                color: '#80699B',
                                y: inconclusive
                            },
                            {
                                color: '#4572A7',
                                y: notRan
                            }
                        ]
                    }    
                ]
            }
            
        });
	}
 
});
