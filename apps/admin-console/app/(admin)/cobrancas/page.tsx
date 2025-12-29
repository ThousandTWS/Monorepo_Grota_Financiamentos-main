import { Button, Card, DatePicker } from 'antd';

export default function ModuloCobranca() {
    return (
        <section>
            <div className='py-3 px-4'>
                <h1>Modulo de Cobrança em Breve</h1>
                <Card className='w-70 py-3 px-4'>
                <DatePicker/>
                <Button type="primary">Primary</Button>
                </Card>
            </div>
        </section>
    )
}

