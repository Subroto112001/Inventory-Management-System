# Upcoming products and pre-orders

Upcoming products use the existing `Product` collection. `lifecycle` is the visibility source of truth (`scheduled`, `live`, or `inactive`); legacy products without the field continue to behave as live products. `launchAt` and pre-order timestamps are stored as UTC dates. `ExclusiveProduct` remains the source of featured ordering and visibility.

## Configure automatic launches

The launch route is `POST /api/scheduler/launch-products` (GET is also supported for schedulers that can only issue GET requests). Set `SCHEDULER_SECRET` in the application environment to a random secret of at least 24 characters. Configure an external scheduler to call the route every minute with:

```http
Authorization: Bearer <SCHEDULER_SECRET>
```

For example, a Linux cron entry can call a small deployment-side `curl` command every minute. Keep the secret in the scheduler's secret store; do not commit it or expose it to the browser. The endpoint processes overdue scheduled products safely on retry. It updates the same product record and upserts the existing featured assignment only when `featuredOnLaunch` is enabled.

The repository does not contain a configured cron provider or production scheduler credentials. Automatic launches are therefore implemented but are not operational until the deployment scheduler is configured. MongoDB transaction support (replica set or sharded cluster) is required for atomic limited-quantity pre-order reservation and order creation.

## Pre-order behavior

Pre-orders create one `Order` with `orderClass: "preorder"`, retain the product/customer/order snapshots, and reserve the configured pre-order capacity. Payment remains `Pending` with Cash on Delivery; this project does not include an online payment processor. Pre-order cancellation releases reserved capacity. Standard product checkout continues to use the existing stock ledger and is restricted to live products.

Dashboard access uses the `upcoming_products.manage` permission (System Admin, Admin, and Manager). The customer pre-order request uses the customer's first saved shipping address when no address ID is supplied; a saved address is required.
