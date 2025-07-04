import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';
import HoverInfo from '@/features/config/HoverInfo';

interface ConfigSliderProps {
	min: number;
	max: number;
	step: number;
	label: string;
	value: number;
	setValue: (val: number) => void;
	defaultValue: number;
	details: string;
}

export default function ConfigSlider({
	min,
	max,
	step,
	label,
	value,
	setValue,
	defaultValue,
	details,
}: ConfigSliderProps) {
	const [inputValue, setInputValue] = useState(value);

	const cleanValue = (val: number) => {
		if (Number.isNaN(inputValue)) {
			return value;
		}
		if (inputValue > max) {
			return max;
		}
		if (inputValue < min) {
			return min;
		}
		if (inputValue % step !== 0) {
			return value;
		}
		return val;
	};
	const commitInputValue = () => {
		const clean = cleanValue(inputValue);
		setInputValue(clean);
		setValue(clean);
	};

	return (
		<div>
			<div className='flex flex-row gap-2 mb-2 items-center'>
				<Label className='text-base'>{label}</Label>
				<HoverInfo details={details} />
			</div>
			<div className='flex items-center gap-4'>
				<div className='flex items-center w-full gap-2'>
					<div className='w-10 text-sm text-muted-foreground text-right m-2'>
						{min}
					</div>
					<Slider
						value={[value]}
						min={min}
						max={max}
						step={step}
						onValueChange={(v: Array<number>) => {
							setValue(v[0]);
							setInputValue(v[0]);
						}}
						className='flex-1'
					/>
					<div className='w-10 text-sm text-muted-foreground m-2'>
						{max}
					</div>
				</div>

				<Input
					type='number'
					value={inputValue}
					min={min}
					max={max}
					onChange={(e) => setInputValue(e.target.valueAsNumber)}
					className='w-24 align-right'
					onBlur={commitInputValue}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							commitInputValue();
						}
					}}
				/>
				<RotateCcw
					onClick={() => setValue(defaultValue)}
					size='18'
					className='text-foreground/40'
				/>
			</div>
		</div>
	);
}
