import { test, expect } from '@playwright/test'

const gymId = 12

const clone = (value) => JSON.parse(JSON.stringify(value))

const buildState = () => ({
  auth: {
    user: { id: 1, name: 'Gym Owner', email: 'owner@chainfit.test' },
    gyms: [{ id: gymId, name: 'Chain Fit Central' }],
  },
  gym: {
    id: gymId,
    name: 'Chain Fit Central',
    verified: 'APPROVED',
    address: 'Jl. Contoh No. 1, Jakarta',
    maxCp: 180,
    jamOperasional: '06.00-22.00',
    description: 'Gym fixture for automated blackbox testing.',
    facility: ['Cardio Zone', 'Free Weights', 'Functional Area'],
    tag: 'Premium,24 Hours',
    gymImage: [],
  },
  plans: [
    { id: 101, name: 'Silver', price: 150000, durationDays: 30, benefit: ['Standard access'] },
    { id: 102, name: 'Gold', price: 250000, durationDays: 30, benefit: ['All access'] },
  ],
  equipments: [
    {
      id: 201,
      name: 'Treadmill Pro',
      jumlah: 2,
      healthStatus: 'RUSAK',
      description: 'Unit with a damaged belt.',
      videoURL: 'https://example.com/treadmill',
      imageUrl: '',
    },
    {
      id: 202,
      name: 'Bench Press',
      jumlah: 4,
      healthStatus: 'BAIK',
      description: 'Ready to use.',
      videoURL: '',
      imageUrl: '',
    },
  ],
  members: [
    {
      id: 301,
      user: { name: 'Andi', email: 'andi@chainfit.test' },
      status: 'AKTIF',
      masaAktifHari: 12,
      paketId: 101,
    },
    {
      id: 302,
      user: { name: 'Budi', email: 'budi@chainfit.test' },
      status: 'NON-AKTIF',
      masaAktifHari: 0,
      paketId: 101,
    },
  ],
  attendance: [
    {
      id: 401,
      membership: { user: { name: 'Andi', email: 'andi@chainfit.test' } },
      checkInAt: '2026-06-01T08:00:00.000Z',
    },
    {
      id: 402,
      membership: { user: { name: 'Budi', email: 'budi@chainfit.test' } },
      checkInAt: '2026-06-02T09:30:00.000Z',
    },
  ],
  staff: [
    { id: 501, name: 'Rina', role: 'Admin', email: 'rina@chainfit.test', profileImage: '' },
  ],
  cashflowOverview: {
    data: {
      summary: { totalIncome: 1350000 },
      incomeTrend: [
        { month: 'Jan', total: 500000 },
        { month: 'Feb', total: 750000 },
        { month: 'Mar', total: 1350000 },
      ],
      expenseTrend: [
        { month: 'Jan', total: 120000 },
        { month: 'Feb', total: 175000 },
        { month: 'Mar', total: 210000 },
      ],
    },
  },
  cashflow: [
    {
      id: 601,
      name: 'Monthly Membership',
      amount: 500000,
      transactionType: 'PENDAPATAN',
      cashflowType: 'CASH',
      date: '2026-06-01',
      note: 'Membership income',
    },
    {
      id: 602,
      name: 'Cleaning Supplies',
      amount: 120000,
      transactionType: 'PENGELUARAN',
      cashflowType: 'CASHLESS',
      date: '2026-06-02',
      note: 'Bathroom and floor cleaning supplies',
    },
  ],
})

const responseJson = (payload, status = 200) => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify(payload),
})

const seedSession = async (page) => {
  await page.addInitScript(() => {
    localStorage.setItem('access_token', 'e2e-access-token')
    localStorage.setItem('refresh_token', 'e2e-refresh-token')
  })
}

const installMockBackend = async (page, state) => {
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const method = request.method()
    const path = url.pathname

    if (method === 'GET' && path === '/api/v1/auth/me') {
      return route.fulfill(responseJson({ data: { user: state.auth.user, gyms: state.auth.gyms } }))
    }

    if (method === 'GET' && path === `/api/v1/gym/${gymId}/cashflow/overview`) {
      return route.fulfill(responseJson(clone(state.cashflowOverview)))
    }

    if (method === 'GET' && path === `/api/v1/gym/${gymId}/cashflow`) {
      return route.fulfill(responseJson({ data: clone(state.cashflow) }))
    }

    if (method === 'POST' && path === `/api/v1/gym/${gymId}/cashflow`) {
      const body = request.postDataJSON()
      const nextRecord = {
        id: Date.now(),
        name: body.name,
        amount: Number(body.amount),
        transactionType: body.transactionType,
        cashflowType: body.cashflowType,
        date: body.date,
        note: body.note,
      }

      state.cashflow.unshift(nextRecord)
      return route.fulfill(responseJson({ data: nextRecord }, 201))
    }

    if (method === 'PUT' && path.startsWith(`/api/v1/gym/${gymId}/cashflow/`)) {
      const cashflowId = Number(path.split('/').pop())
      const body = request.postDataJSON()
      const target = state.cashflow.find((item) => item.id === cashflowId)

      if (target) {
        Object.assign(target, body)
      }

      return route.fulfill(responseJson({ data: target || body }))
    }

    if (method === 'DELETE' && path.startsWith(`/api/v1/gym/${gymId}/cashflow/`)) {
      const cashflowId = Number(path.split('/').pop())
      state.cashflow = state.cashflow.filter((item) => item.id !== cashflowId)
      return route.fulfill(responseJson({ code: 200 }))
    }

    if (method === 'GET' && path === `/api/v1/gym/${gymId}`) {
      return route.fulfill(responseJson({ data: clone(state.gym) }))
    }

    if (method === 'PUT' && path === `/api/v1/gym/${gymId}`) {
      const body = request.postDataJSON()
      state.gym = {
        ...state.gym,
        name: body.name ?? state.gym.name,
        maxCp: Number(body.maxCp ?? state.gym.maxCp),
        address: body.address ?? state.gym.address,
        jamOperasional: body.jamOperasional ?? state.gym.jamOperasional,
        description: body.description ?? state.gym.description,
      }
      return route.fulfill(responseJson({ data: clone(state.gym) }))
    }

    if (method === 'GET' && path === `/api/v1/gym/${gymId}/equipment`) {
      return route.fulfill(responseJson({ data: clone(state.equipments), recordsTotal: state.equipments.length }))
    }

    if (method === 'GET' && path.startsWith(`/api/v1/gym/${gymId}/equipment/`)) {
      const equipId = Number(path.split('/').pop())
      const equipment = state.equipments.find((item) => item.id === equipId)
      return route.fulfill(responseJson({ data: clone(equipment) }))
    }

    if (method === 'PUT' && path.startsWith(`/api/v1/gym/${gymId}/equipment/`)) {
      const equipId = Number(path.split('/').pop())
      const body = request.postDataJSON()
      const equipment = state.equipments.find((item) => item.id === equipId)

      if (equipment) {
        Object.assign(equipment, body)
      }

      return route.fulfill(responseJson({ data: clone(equipment || body) }))
    }

    if (method === 'DELETE' && path.startsWith(`/api/v1/gym/${gymId}/equipment/`)) {
      const equipId = Number(path.split('/').pop())
      state.equipments = state.equipments.filter((item) => item.id !== equipId)
      return route.fulfill(responseJson({ data: true }))
    }

    if (method === 'GET' && path === `/api/v1/gym/${gymId}/paket-member`) {
      return route.fulfill(responseJson({ data: clone(state.plans) }))
    }

    if (method === 'GET' && path === `/api/v1/gym/${gymId}/memberships`) {
      return route.fulfill(responseJson({ data: clone(state.members), recordsTotal: state.members.length }))
    }

    if (method === 'PUT' && path.startsWith(`/api/v1/gym/${gymId}/memberships/`)) {
      const memberId = Number(path.split('/').pop())
      const body = request.postDataJSON()
      const member = state.members.find((item) => item.id === memberId)

      if (member && body.paketId) {
        member.paketId = Number(body.paketId)
      }

      if (member && body.status) {
        member.status = body.status
      }

      return route.fulfill(responseJson({ data: clone(member) }))
    }

    if (method === 'GET' && path === `/api/v1/attendance/history/${gymId}`) {
      return route.fulfill(responseJson({ data: clone(state.attendance) }))
    }

    if (method === 'GET' && path === `/api/v1/gym/${gymId}/gym-staff`) {
      return route.fulfill(responseJson({ code: 200, data: clone(state.staff) }))
    }

    if (method === 'GET' && path.startsWith(`/api/v1/gym/${gymId}/gym-staff/`)) {
      const staffId = Number(path.split('/').pop())
      const staff = state.staff.find((item) => item.id === staffId)
      return route.fulfill(responseJson({ code: 200, data: clone(staff) }))
    }

    if (method === 'PUT' && path.startsWith(`/api/v1/gym/${gymId}/gym-staff/`)) {
      const staffId = Number(path.split('/').pop())
      const body = request.postData()
      const staff = state.staff.find((item) => item.id === staffId)

      if (staff && body) {
        staff.name = body.name || staff.name
        staff.email = body.email || staff.email
      }

      return route.fulfill(responseJson({ code: 200, data: clone(staff) }))
    }

    return route.fallback()
  })
}

const gotoAuthedPage = async (page, path) => {
  await page.goto(`/#${path}`)
  await page.getByText('Gym Owner').waitFor({ state: 'visible' })
}

test.describe('Blackbox testing otomatis', () => {
  test.beforeEach(async ({ page }) => {
    await seedSession(page)
    await installMockBackend(page, buildState())
  })

  test('TC-BB-001 - dashboard finansial menampilkan ringkasan pendapatan dan pengeluaran', async ({ page }) => {
    await gotoAuthedPage(page, '/dashboard')

    await expect(page.getByText('Total Members')).toBeVisible()
    await expect(page.getByText('Active Staff')).toBeVisible()
    await expect(page.getByText('Total Equipment')).toBeVisible()
    await expect(page.getByText('Total Revenue')).toBeVisible()
    await expect(page.getByText(/Rp\s?1\.350\.000/)).toBeVisible()
    await expect(page.getByText('Income Trend')).toBeVisible()
    await expect(page.getByText('Expense Trend')).toBeVisible()
    await expect(page.getByText('Recent Transactions')).toBeVisible()
    await expect(page.getByText('Facility Condition')).toBeVisible()
  })

  test('TC-BB-002 - monitoring alat membuka detail alat berstatus rusak', async ({ page }) => {
    await gotoAuthedPage(page, '/info')

    await expect(page.getByText('Gym Equipment List')).toBeVisible()
    await expect(page.getByText('Damaged')).toBeVisible()

    await page.getByRole('button', { name: 'Details' }).first().click()

    await expect(page.getByText('Equipment Details')).toBeVisible()
    await expect(page.getByText('Condition Status')).toBeVisible()
    await expect(page.getByText('Damaged')).toBeVisible()
  })

  test('TC-BB-003 - riwayat kehadiran member dapat difilter berdasarkan tanggal', async ({ page }) => {
    await gotoAuthedPage(page, '/anggota')

    await expect(page.getByText('Attendance History')).toBeVisible()
    await page.locator('input[type="date"]').fill('2026-06-01')

    await expect(page.getByText('2026-06-01')).toBeVisible()
    await expect(page.getByText('2026-06-02')).toHaveCount(0)
  })

  test('TC-BB-004 - membership dapat diubah melalui halaman edit member', async ({ page }) => {
    await gotoAuthedPage(page, '/anggota')

    await page.getByRole('button', { name: 'Edit' }).first().click()
    await expect(page.getByText('Membership Renewal')).toBeVisible()

    await page.getByText('Silver').click()
    await page.getByRole('button', { name: 'Save Changes' }).click()

    await expect(page).toHaveURL(/\/anggota$/)

    await page.goto('/#/anggota/edit/301')
    await expect(page.locator('.paket-selected').filter({ hasText: 'Silver' })).toBeVisible()
  })

  test('TC-BB-005 - transaksi keuangan baru dapat ditambahkan', async ({ page }) => {
    await gotoAuthedPage(page, '/finance/tambah')

    await page.getByPlaceholder('e.g., Monthly Membership').fill('Cleaning Supplies')
    await page.getByPlaceholder('0').fill('275000')
    await page.getByRole('button', { name: 'Expense' }).click()

    await page.getByRole('combobox').nth(1).click()
    await page.getByRole('option', { name: 'Cash' }).click()

    await page.getByRole('button', { name: 'Save Transaction' }).click()

    await expect(page).toHaveURL(/\/finance$/)
    await expect(page.getByText('Cleaning Supplies')).toBeVisible()
  })

  test('TC-BB-006 - notifikasi sistem dapat dibuka dari dashboard', async ({ page }) => {
    await gotoAuthedPage(page, '/dashboard')

    await page.locator('header button').first().click()

    await expect(page.getByText('Notifikasi', { exact: true })).toBeVisible()
    await expect(page.getByText('Belum ada notifikasi baru')).toBeVisible()
  })

  test('TC-BB-007 - informasi operasional gym dapat diperbarui', async ({ page }) => {
    await gotoAuthedPage(page, '/info/edit')

    await page.getByPlaceholder('e.g., Elite Fitness Studio').fill('Chain Fit Premium')
    await page.getByPlaceholder('e.g., 150').fill('220')
    await page.getByPlaceholder('e.g., 123 Fitness Ave, West Java').fill('Jl. Baru No. 10, Bandung')
    await page.getByPlaceholder('e.g., Mon-Fri: 06:00 AM - 10:00 PM').fill('07.00-23.00')
    await page.getByPlaceholder('Enter a detailed description of the gym...').fill('Updated gym information for automation.')

    await page.getByRole('button', { name: 'Save Changes' }).click()

    await expect(page).toHaveURL(/#\/info$/)
    await expect(page.getByText('Chain Fit Premium')).toBeVisible()
    await expect(page.getByText('07.00-23.00')).toBeVisible()
  })
})