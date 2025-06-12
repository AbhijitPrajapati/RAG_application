import React from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from './ui/drawer'

import { Button } from './ui/button';
import ConfigSlider from './ConfigSlider';

export default function ConfigDrawer( { config, setConfig, resetConfig } ) {


    return (
        <div className='w-full p-3'>
            <Drawer>
                
                <DrawerTrigger asChild>
                    <Button className='w-full'>Configurations</Button>
                </DrawerTrigger>
                

                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Configurations</DrawerTitle>
                    </DrawerHeader>
                    <DrawerFooter>

                        <div className='w-7/10 mx-auto'>

                            <ConfigSlider min={1} max={10} step={1} label='N Chunks' value={[config.n_chunks]} setValue={
                                    (v) => setConfig(prev => ({ 
                                        ...prev,
                                        n_chunks: v[0]
                                    }))
                            }></ConfigSlider>

                            <ConfigSlider min={64} max={2048} step={32} label='Max Tokens' value={[config.max_tokens]} setValue={
                                    (v) => setConfig(prev => ({ 
                                        ...prev,
                                        max_tokens: v[0]
                                    }))
                            }></ConfigSlider>

                            <ConfigSlider min={0} max={1} step={0.05} label='Temperature' value={[config.temperature]} setValue={
                                    (v) => setConfig(prev => ({ 
                                        ...prev,
                                        temperature: v[0]
                                    }))
                            }></ConfigSlider>

                        </div>

                        
                        <div className='flex flex-row mx-auto p-2 gap-x-4'>
                            <DrawerClose>
                                <Button variant='outline'>Cancel</Button>
                            </DrawerClose>
                            <Button onClick={resetConfig}>Reset</Button>
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}