import { useState } from 'react';
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from 'recharts';
import './GenerationMixChart.css';

// Fuel definitions. The order here is the stacking order, bottom to top.
const FUELS = [
	{ key: 'nuclear', name: 'Nuclear', color: '#8b5cf6' },
	{ key: 'wind', name: 'Wind', color: '#3b82f6' },
	{ key: 'solar', name: 'Solar', color: '#f59e0b' },
	{ key: 'other', name: 'Hydro / Biomass / Other', color: '#84cc16' },
	{ key: 'imports', name: 'Imports', color: '#14b8a6' },
	{ key: 'gas', name: 'Gas (CCGT)', color: '#6b7280' },
];

// Illustrative GB demand across 24 hours (GW): overnight trough, morning and evening peaks.
const DEMAND = [
	28, 27, 26, 26, 27, 30, 34, 38, 40, 40, 39, 38, 37, 36, 36, 37, 39, 43, 45, 44, 41, 37, 33, 30,
];

function buildData(scenario) {
	const windBase = scenario === 'high' ? 18 : 5;
	const windSwing = scenario === 'high' ? 3 : 1;
	return DEMAND.map((demand, hour) => {
		const solar = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI)) * 6;
		const wind = windBase + Math.sin(hour / 3) * windSwing;
		const nuclear = 4.8;
		const imports = 3 + Math.sin(hour / 5);
		const other = 2.5;
		// Gas is the residual plant: it makes up whatever demand the others don't meet.
		const gas = Math.max(0, demand - solar - wind - nuclear - imports - other);
		const r = (x) => Math.round(x * 10) / 10;
		return {
			hour: `${String(hour).padStart(2, '0')}:00`,
			nuclear: r(nuclear),
			wind: r(wind),
			solar: r(solar),
			other: r(other),
			imports: r(imports),
			gas: r(gas),
		};
	});
}

export default function GenerationMixChart() {
	const [scenario, setScenario] = useState('high');
	const [hidden, setHidden] = useState({});
	const data = buildData(scenario);

	const toggle = (key) => {
		if (!key) return;
		setHidden((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	return (
		<div className="gm-chart">
			<div className="gm-controls">
				<span className="gm-label">Scenario</span>
				<button
					type="button"
					className={scenario === 'high' ? 'gm-btn gm-btn--active' : 'gm-btn'}
					onClick={() => setScenario('high')}
				>
					High-wind day
				</button>
				<button
					type="button"
					className={scenario === 'low' ? 'gm-btn gm-btn--active' : 'gm-btn'}
					onClick={() => setScenario('low')}
				>
					Low-wind day
				</button>
			</div>

			<ResponsiveContainer width="100%" height={380}>
				<AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4dccd" />
					<XAxis dataKey="hour" tick={{ fontSize: 12 }} interval={2} stroke="#948975" />
					<YAxis tick={{ fontSize: 12 }} width={64} unit=" GW" stroke="#948975" />
					<Tooltip formatter={(value, name) => [`${value} GW`, name]} />
					<Legend
						onClick={(entry) => toggle(entry && entry.dataKey)}
						wrapperStyle={{ cursor: 'pointer', fontSize: 13, paddingTop: 8 }}
						formatter={(value, entry) => {
							const key = entry && entry.dataKey;
							const off = key && hidden[key];
							return (
								<span
									style={{
										color: off ? '#b8b0a2' : '#221d18',
										textDecoration: off ? 'line-through' : 'none',
									}}
								>
									{value}
								</span>
							);
						}}
					/>
					{FUELS.map((fuel) => (
						<Area
							key={fuel.key}
							type="monotone"
							dataKey={fuel.key}
							name={fuel.name}
							stackId="mix"
							stroke={fuel.color}
							fill={fuel.color}
							fillOpacity={0.85}
							hide={!!hidden[fuel.key]}
							isAnimationActive={false}
						/>
					))}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
