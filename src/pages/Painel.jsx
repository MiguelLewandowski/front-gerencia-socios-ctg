import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, CheckCircle, AlertCircle, UserPlus } from 'lucide-react'
import Layout from '../components/Layout'
import Badge from '../components/Badge'
import StatCard from '../components/StatCard'
import EmptyState from '../components/EmptyState'
import { getSocios } from '../services/sociosService'

function parseDate(str) {
  if (!str) return new Date(0)
  if (str.includes('-')) {
    const [y, m, d] = str.split('-')
    return new Date(y, m - 1, d)
  }
  if (str.includes('/')) {
    const [d, m, y] = str.split('/')
    return new Date(y, m - 1, d)
  }
  return new Date(str)
}

function formatDateBR(str) {
  if (!str) return ''
  if (str.includes('-')) {
    const [y, m, d] = str.split('-')
    return `${d}/${m}/${y}`
  }
  return str
}

export default function Painel() {
  const [socios, setSocios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSocios()
      .then(data => {
        setSocios(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(`Erro ao carregar dados do painel: ${err.message}`)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Layout>
        <main className="flex-1 bg-[#f0f2f5] flex items-center justify-center py-24">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-gray-500 text-sm">Carregando painel...</p>
          </div>
        </main>
      </Layout>
    )
  }

  const ativos = socios.filter(s => s.status === 'Ativo').length
  const inadimplentes = socios.filter(s => s.mensalidade === 'Atrasado')
  const novosAno = socios.filter(s => {
    const date = parseDate(s.data_entrada)
    return date.getFullYear() === 2026
  }).length

  const ultimosCadastros = [...socios]
    .sort((a, b) => parseDate(b.data_entrada) - parseDate(a.data_entrada))
    .slice(0, 5)

  return (
    <Layout>
      <main className="flex-1 bg-[#f0f2f5]">
        <div className="max-w-7xl mx-auto px-6 py-7">

          <div className="mb-7">
            <h1 className="text-[#1a3560] text-3xl font-bold mb-1">Painel</h1>
            <p className="text-gray-500">Visão geral do sistema de sócios</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard label="Total de Sócios"  value={socios.length}        icon={<Users size={22} />}        colorClass="bg-blue-100 text-blue-600"  />
            <StatCard label="Sócios Ativos"    value={ativos}               icon={<CheckCircle size={22} />}  colorClass="bg-green-100 text-green-700" />
            <StatCard label="Inadimplentes"    value={inadimplentes.length} icon={<AlertCircle size={22} />}  colorClass="bg-red-100 text-red-600"    />
            <StatCard label="Novos Este Ano"   value={novosAno}             icon={<UserPlus size={22} />}     colorClass="bg-gray-200 text-gray-700"  />
          </div>

          <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-6">
            <h3 className="text-[#1a3560] text-lg font-bold mb-5">Últimos Cadastros</h3>
            {ultimosCadastros.length === 0 ? (
              <EmptyState
                icon={<Users size={40} />}
                title="Nenhum sócio cadastrado"
                description="Cadastre um novo sócio para começar."
              />
            ) : (
              ultimosCadastros.map(socio => (
                <Link
                  key={socio.id}
                  to={`/socios/${socio.id}`}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-3 hover:bg-blue-50 transition-colors cursor-pointer no-underline text-inherit"
                >
                  <div>
                    <h4 className="font-bold mb-1">{socio.nome}</h4>
                    <p className="text-sm text-gray-500">Cadastrado em {formatDateBR(socio.data_entrada)}</p>
                  </div>
                  <Badge color={socio.status === 'Ativo' ? 'green' : 'red'}>
                    {socio.status}
                  </Badge>
                </Link>
              ))
            )}
            <Link to="/socios" className="block text-center mt-3 text-blue-600 font-bold hover:underline">
              Ver todos os sócios →
            </Link>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-6">
            <h3 className="text-red-600 text-lg font-bold mb-5">Inadimplentes</h3>
            {inadimplentes.length === 0 ? (
              <EmptyState
                icon={<CheckCircle size={40} />}
                title="Nenhum inadimplente"
                description="Todos os sócios estão com a mensalidade em dia."
              />
            ) : (
              inadimplentes.map(socio => (
                <Link
                  key={socio.id}
                  to={`/socios/${socio.id}`}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-3 hover:bg-red-50 transition-colors cursor-pointer no-underline text-inherit"
                >
                  <div>
                    <h4 className="font-bold mb-1">{socio.nome}</h4>
                    <p className="text-sm text-red-600">Último pagamento: {socio.ultimoPagamento ? formatDateBR(socio.ultimoPagamento) : 'Não informado'}</p>
                  </div>
                  <Badge color="red">Atrasado</Badge>
                </Link>
              ))
            )}
            {inadimplentes.length > 0 && (
              <Link to="/socios" className="block text-center mt-3 text-blue-600 font-bold hover:underline">
                Ver todos →
              </Link>
            )}
          </section>

        </div>
      </main>
    </Layout>
  )
}
