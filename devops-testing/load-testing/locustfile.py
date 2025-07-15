from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    wait_time = between(1, 2)
    
    @task
    def hello_world(self):
        self.client.get("/")
    
    @task(3)
    def view_items(self):
        for item_id in range(10):
            self.client.get(f"/change/{item_id}")