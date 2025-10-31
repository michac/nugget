import pygame
import sys
import asyncio

# Initialize pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
DARK_BLUE = (20, 30, 50)
GOLD = (255, 215, 0)

# Game settings
PADDLE_SPEED = 8
BALL_SPEED = 4  # Slower speed for beginners
BRICK_ROWS = 5
BRICK_COLS = 10
BRICK_SPACING = 5

# Set up the display
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Nugget Breakout")
clock = pygame.time.Clock()


class Paddle:
    def __init__(self):
        self.width = 120
        self.height = 20
        self.x = SCREEN_WIDTH // 2 - self.width // 2
        self.y = SCREEN_HEIGHT - 50
        self.speed = PADDLE_SPEED
        self.rect = pygame.Rect(self.x, self.y, self.width, self.height)

    def move(self, keys):
        if keys[pygame.K_LEFT] and self.rect.left > 0:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT] and self.rect.right < SCREEN_WIDTH:
            self.rect.x += self.speed

    def draw(self, surface):
        pygame.draw.rect(surface, WHITE, self.rect)


class Ball:
    def __init__(self, nugget_image):
        self.image = pygame.transform.scale(nugget_image, (30, 30))
        self.rect = self.image.get_rect()
        self.reset()

    def reset(self):
        self.rect.centerx = SCREEN_WIDTH // 2
        self.rect.centery = SCREEN_HEIGHT // 2
        self.vel_x = BALL_SPEED
        self.vel_y = -BALL_SPEED

    def update(self):
        self.rect.x += self.vel_x
        self.rect.y += self.vel_y

        # Bounce off walls
        if self.rect.left <= 0 or self.rect.right >= SCREEN_WIDTH:
            self.vel_x *= -1

        # Bounce off top
        if self.rect.top <= 0:
            self.vel_y *= -1

        # Check if ball fell off bottom (lose condition - for now just reset)
        if self.rect.top >= SCREEN_HEIGHT:
            self.reset()

    def bounce_y(self):
        self.vel_y *= -1

    def bounce_x(self):
        self.vel_x *= -1

    def draw(self, surface):
        surface.blit(self.image, self.rect)


class Brick:
    def __init__(self, x, y, image):
        self.image = image
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        self.alive = True

    def draw(self, surface):
        if self.alive:
            surface.blit(self.image, self.rect)


def create_bricks(burger_image):
    bricks = []
    # Scale burger to appropriate brick size
    brick_width = (SCREEN_WIDTH - (BRICK_COLS + 1) * BRICK_SPACING) // BRICK_COLS
    brick_height = 30
    scaled_burger = pygame.transform.scale(burger_image, (brick_width, brick_height))

    # Start bricks after some empty space at top
    start_y = 80

    for row in range(BRICK_ROWS):
        for col in range(BRICK_COLS):
            x = col * (brick_width + BRICK_SPACING) + BRICK_SPACING
            y = row * (brick_height + BRICK_SPACING) + start_y
            brick = Brick(x, y, scaled_burger)
            bricks.append(brick)

    return bricks


# Load assets
nugget_image = pygame.image.load("assets/nugget.png")
burger_image = pygame.image.load("assets/burger_brick.png")

# Load sounds
pygame.mixer.init()
fart_sound = pygame.mixer.Sound("assets/fart.ogg")

# Create game objects
paddle = Paddle()
ball = Ball(nugget_image)
bricks = create_bricks(burger_image)

# Font
font = pygame.font.Font(None, 72)
small_font = pygame.font.Font(None, 36)

# Game state
game_over = False
won = False

# Main game loop
async def main():
    global game_over, won
    running = True
    while running:
        clock.tick(FPS)
        await asyncio.sleep(0)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and game_over:
                    # Reset game
                    ball.reset()
                    bricks = create_bricks(burger_image)
                    game_over = False
                    won = False

        if not game_over:
            # Get keys
            keys = pygame.key.get_pressed()

            # Update paddle
            paddle.move(keys)

            # Update ball
            ball.update()

            # Check collision with paddle
            if ball.rect.colliderect(paddle.rect) and ball.vel_y > 0:
                ball.bounce_y()
                fart_sound.play()
                # Add some horizontal velocity based on where it hit the paddle
                hit_pos = (ball.rect.centerx - paddle.rect.centerx) / (paddle.width / 2)
                ball.vel_x = hit_pos * BALL_SPEED

            # Check collision with bricks
            for brick in bricks:
                if brick.alive and ball.rect.colliderect(brick.rect):
                    brick.alive = False
                    ball.bounce_y()
                    break

            # Check win condition
            if all(not brick.alive for brick in bricks):
                game_over = True
                won = True

        # Draw everything
        screen.fill(DARK_BLUE)

        # Draw game objects
        paddle.draw(screen)
        ball.draw(screen)
        for brick in bricks:
            brick.draw(screen)

        # Draw game over screen
        if game_over:
            if won:
                text = font.render("YOU WIN!", True, GOLD)
            else:
                text = font.render("GAME OVER", True, WHITE)
            text_rect = text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2))
            screen.blit(text, text_rect)

            restart_text = small_font.render("Press SPACE to play again", True, WHITE)
            restart_rect = restart_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 60))
            screen.blit(restart_text, restart_rect)

        # Update display
        pygame.display.flip()

asyncio.run(main())
pygame.quit()
sys.exit()
