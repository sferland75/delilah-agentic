import asyncio
from typing import Dict, Any, Callable, Awaitable, List
import logging

logger = logging.getLogger(__name__)

class MessageQueue:
    def __init__(self):
        self.subscribers: Dict[str, List[Callable[[Dict[str, Any]], Awaitable[None]]]] = {}
        self.queue: asyncio.Queue = asyncio.Queue()

    async def publish(self, message: Dict[str, Any]) -> None:
        """Publish a message to the queue"""
        await self.queue.put(message)
        message_type = message.get("type", "unknown")
        logger.info(f"Published message of type: {message_type}")

    def subscribe(self, message_type: str, callback: Callable[[Dict[str, Any]], Awaitable[None]]) -> None:
        """Subscribe to messages of a specific type"""
        if message_type not in self.subscribers:
            self.subscribers[message_type] = []
        self.subscribers[message_type].append(callback)
        logger.info(f"New subscriber for message type: {message_type}")

    async def process_messages(self) -> None:
        """Process messages from the queue"""
        while True:
            try:
                message = await self.queue.get()
                message_type = message.get("type", "unknown")
                
                if message_type in self.subscribers:
                    tasks = []
                    for callback in self.subscribers[message_type]:
                        task = asyncio.create_task(callback(message))
                        tasks.append(task)
                    
                    if tasks:
                        await asyncio.gather(*tasks)
                
                self.queue.task_done()
                logger.info(f"Processed message of type: {message_type}")
            
            except Exception as e:
                logger.error(f"Error processing message: {str(e)}")
                # Continue processing next message even if one fails
                continue