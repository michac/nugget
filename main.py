import pygame
import sys

# Initialize pygame
pygame.init()

# Set up the display
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Nugget Game")

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GOLD = (255, 215, 0)

# Font
font = pygame.font.Font(None, 64)

# Main game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Fill background
    screen.fill(WHITE)

    # Render title at the top
    title_text = font.render("Nugget Game", True, GOLD)
    title_rect = title_text.get_rect(centerx=400, y=20)
    screen.blit(title_text, title_rect)

    # Update display
    pygame.display.flip()

pygame.quit()
sys.exit()
