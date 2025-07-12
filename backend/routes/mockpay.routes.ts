import { Router } from "express";

const router = Router();

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  res.send(`
    <h2>Mock Invoice #${id}</h2>
    <p>Click the button to mark this donation as <b>PAID</b>.</p>
    <button onclick="pay()">Mark as PAID</button>
    <script>
      function pay () {
        fetch('/donations/webhook/qpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceId: ${id}, paid: true })
        })
        .then(() => alert(' Marked PAID — you can close this tab.'))
        .catch(() => alert('Error calling webhook'));
      }
    </script>
  `);
});

export default router;
