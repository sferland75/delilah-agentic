# ... (previous imports remain the same)

class ClientSearch(BaseModel):
    query: str

# ... (previous code remains the same)

@app.post("/clients/search")
async def search_clients(search: ClientSearch):
    return await client_manager.search_clients(search.query)
