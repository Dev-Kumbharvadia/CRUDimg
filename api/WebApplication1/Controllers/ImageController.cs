using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models; 

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ImageController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            byte[] fileContent;
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                fileContent = memoryStream.ToArray();
            }

            var image = new Image
            {
                FileName = file.FileName,
                FileContent = fileContent
            };

            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            return Ok(new { image.Id, image.FileName });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            var image = await _context.Images.FindAsync(id);
            if (image == null)
                return NotFound();

            return File(image.FileContent, "image/jpeg", image.FileName);  // Adjust MIME type if needed
        }

        [HttpGet]
        public async Task<IActionResult> GetAllImage()
        {
            var image = await _context.Images.ToListAsync();
            if (image == null)
                return NotFound();

            return Ok(image);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _context.Images.FindAsync(id);
            if (image == null)
                return NotFound();

            _context.Images.Remove(image);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Image deleted successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateImage(int id, IFormFile file)
        {
            var image = await _context.Images.FindAsync(id);
            if (image == null)
                return NotFound();

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                image.FileContent = memoryStream.ToArray();
            }
            image.FileName = file.FileName;

            _context.Images.Update(image);
            await _context.SaveChangesAsync();

            return Ok(new { image.Id, image.FileName });
        }
    }
}