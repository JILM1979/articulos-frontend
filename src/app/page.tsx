'use client';

import { useEffect, useState } from 'react';

type Articulo = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
};

type LineaPedido = {
  articulo_id: number;
  cantidad: number;
  pedido_id: string;
};

export default function Home() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [lineas, setLineas] = useState<LineaPedido[]>([]);
  const [pedidoId, setPedidoId] = useState('');

  useEffect(() => {
    fetch('articulos-microservicio-production.up.railway.app/api/articulos')
      .then((res) => res.json())
      .then(setArticulos);
  }, []);

  const addLinea = () => {
    setLineas([...lineas, { articulo_id: articulos[0]?.id ?? 0, cantidad: 1, pedido_id: pedidoId }]);
  };

  const updateLinea = (index: number, key: keyof LineaPedido, value:  LineaPedido[keyof LineaPedido]) => {
    const updated = [...lineas];
    //updated[index][key] = value;
    updated[index] = {
      ...updated[index],
      [key]: value,
    };    
    setLineas(updated);
  };

  const enviarPedido = async () => {
    const payload = lineas.map(linea => ({ ...linea, pedido_id: pedidoId }));
    const res = await fetch('articulos-microservicio-production.up.railway.app/api/articulos/lineas-pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Pedido enviado correctamente');
      setLineas([]);
    } else {
      alert('Error al enviar pedido');
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear líneas de pedido</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">ID del pedido</label>
        <input
          type="text"
          className="border px-3 py-2 rounded w-full"
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
        />
      </div>

      {lineas.map((linea, index) => (
        <div key={index} className="mb-4 flex items-center gap-4">
          <select
            className="border rounded px-3 py-2"
            value={linea.articulo_id}
            onChange={(e) => updateLinea(index, 'articulo_id', Number(e.target.value))}
          >
            {articulos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="border px-2 py-1 rounded w-24"
            value={linea.cantidad}
            min={1}
            onChange={(e) => updateLinea(index, 'cantidad', Number(e.target.value))}
          />
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button onClick={addLinea} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Añadir línea
        </button>
        <button
          onClick={enviarPedido}
          disabled={!pedidoId || lineas.length === 0}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enviar pedido
        </button>
      </div>
    </main>
  );
}
