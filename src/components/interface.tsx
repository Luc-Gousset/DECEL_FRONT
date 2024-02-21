export enum GPIO_State {
    Output,
    Input,
    Disabled,
};

export interface GPIO_t {
    id: number,
    state: GPIO_State,
    value: number,
    name: string,
}

export interface Card_t {
    name: string,
    serial_port: string,
}

export interface AnalogIN_t {
    id: number,
    name: string,
    value: number,
    is_enable: boolean,
}

export enum AnalogOUT_Mode {
    MODE_5V = 5,
    MODE_3_3V = 3.3,
    MODE_4_096V = 4.096,
}

export interface AnalogOUT_t {
    id: number,
    name: string,
    value: number,
    is_enable: boolean,
    mode: AnalogOUT_Mode,
}


export interface Card_config {
    Gpio_conf: Array<GPIO_t>,
    AnalogIn_conf: Array<AnalogIN_t>,
    AnalogOut_conf: Array<AnalogOUT_t>,
    MCP41010_conf: MCP41010_t,
} 

export interface SocketInterface {
    message_header: string,
    card_id: number,
    data: any,
}

export interface MCP41010_t {
    id: number,
    name: string,
    position: number,
    is_enable: boolean,
}

