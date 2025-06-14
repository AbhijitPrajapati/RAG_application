import React from 'react';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function ConfigSlider( { min, max, step, label, value, setValue } ) {
    return (
        <div className='p-3'>
            <Label>{label}</Label>
            <div className='flex items-center gap-4'>
                <div className='flex items-center w-full gap-2'>
                    <div className='w-[40px] text-sm text-muted-foreground text-right m-2'>{min}</div>
                    <Slider value={value} min={min} max={max} step={step} onValueChange={(v) => setValue(v[0])} className='flex-1'/>
                    <div className='w-[40px] text-sm text-muted-foreground m-2'>{max}</div>
                </div>
                    
                <Input type='number' value={value[0]} min={min} max={max} onChange={(e) => setValue(Number(e.target.value))} className='w-1/10 align-right'/>
            </div>
        </div>
    );
}