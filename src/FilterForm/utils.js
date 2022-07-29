const _availableFilters = [
	{
		id: '1',
		title: 'Weight',
		filterKey: '_weight',
		editLink: '#',
	},
	{
		id: '2',
		title: 'Reset Filters',
		filterKey: '',
		editLink: '#',
	},
	{
		id: '3',
		title: 'Active Filters',
		filterKey: '',
		editLink: '#',
	},
	{
		id: '4',
		title: 'Per Page',
		filterKey: '_per-page',
		editLink: '#',
	},
	{
		id: '5',
		title: 'Sort By',
		filterKey: '_sort-by',
		editLink: '#',
	},
	{
		id: '6',
		title: 'Size',
		filterKey: '_size',
		editLink: '#',
	},
	{
		id: '7',
		title: 'Stock Status',
		filterKey: '_stock-status',
		editLink: '#',
	},
	{
		id: '8',
		title: 'Price',
		filterKey: '_price',
		editLink: '#',
	},
	{
		id: '9',
		title: 'Color',
		filterKey: '_color',
		editLink: '#',
	},
	{
		id: '10',
		title: 'Category',
		filterKey: '_product-cat',
		editLink: '#',
	},
];

export const getAvailableFilters = () => _availableFilters;
