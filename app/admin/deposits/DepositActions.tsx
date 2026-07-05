'use client'

export default function DepositActions({
  id,
}:{
  id:string
}) {

  async function approveDeposit() {

    try {

      console.log(
        'APPROVING:',
        id
      )

      const res =
      await fetch(
        `/api/admin/deposits/${id}/approve`,
        {
          method:'POST',
          cache:'no-store',
        }
      )

      const data =
      await res.json()

      console.log(
        'APPROVE RESPONSE:',
        data
      )

      if(!res.ok){

        alert(
          data.error ||
          'Approval failed'
        )

        return
      }

      alert(
        'Deposit approved'
      )

      window.location.reload()

    } catch(err){

      console.error(
        'APPROVE ERROR:',
        err
      )

      alert(
        'Request failed'
      )
    }
  }

  return(

    <button
      onClick={
        approveDeposit
      }
      className="
      bg-green-600
      px-4
      py-2
      rounded-xl
      "
    >
      Approve
    </button>

  )
}