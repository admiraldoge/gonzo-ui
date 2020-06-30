export const paidOrderColumns = [
		 {
			 title: 'ID',
			 dataIndex: 'orderId',
			 key: 'orderId'
		 },
		 {
			 title: 'Fecha',
			 dataIndex: 'paidOrderDate',
			 key: 'date'
		 },
		 {
			 title: 'Cliente',
			 dataIndex: 'firstName',
			 key: 'firstName'
		 },
		 {
			 title: 'Dirección',
			 dataIndex: 'address',
			 key: 'address'
		 }
	 ];

export const preparedOrderColumns = [
	{
		title: 'ID',
		dataIndex: 'orderId',
		key: 'orderId'
	},
	{
		title: 'Fecha Pedido',
		dataIndex: 'paidOrderDate',
		key: 'paidOrderDate'
	},
	{
		title: 'Cliente',
		dataIndex: 'firstName',
		key: 'firstName'
	},
	{
		title: 'Fecha de Despacho',
		dataIndex: 'dispatchedOrderDate',
		key: 'dispatchedOrderDate'
	}
];

export const dispatchedOrderColumns = [
	{
		title: 'ID',
		dataIndex: 'orderId',
		key: 'orderId'
	},
	{
		title: 'Fecha Preparado',
		dataIndex: 'preparedOrderDate',
		key: 'preparedOrderDate'
	},
	{
		title: 'Fecha de Recojo',
		dataIndex: 'dispatchedOrderDate',
		key: 'dispatchedOrderDate'
	}
];

export const deliveredOrderColumns = [
	{
		title: 'ID',
		dataIndex: 'orderId',
		key: 'orderId'
	},
	{
		title: 'Cliente',
		dataIndex: 'firstName',
		key: 'firstName'
	},
	{
		title: 'Fecha de Despachado',
		dataIndex: 'dispatchedOrderDate',
		key: 'dispatchedOrderDate'
	},
	{
		title: 'Fecha de Entregado',
		dataIndex: 'deliveredOrderDate',
		key: 'deliveredOrderDate'
	}
];
