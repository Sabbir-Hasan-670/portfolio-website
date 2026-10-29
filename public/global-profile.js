/**
 * Global Profile Hydration & Helpers
 * Sabbir Hasan Portfolio (sabbirhasan.com)
 */
(function() {
    window.GlobalProfile = {
        fallbackImage: '/uploads/1789156728823-569590328.jpg',
        getImage: function(data) {
            if (!data) return this.fallbackImage;
            return data.profile_pic_path || this.fallbackImage;
        },
        applyImage: function(imgEl, data) {
            if (!imgEl) return;
            var src = this.getImage(data);
            if (!imgEl.src.endsWith(src)) {
                imgEl.src = src;
            }
        }
    };
})();

