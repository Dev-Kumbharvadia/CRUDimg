namespace WebApplication1.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public byte[] FileContent { get; set; } = Array.Empty<byte>();
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
    }
}
