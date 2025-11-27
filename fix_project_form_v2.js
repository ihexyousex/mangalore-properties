
const fs = require('fs');
const path = require('path');

const backupPath = path.join('components', 'admin', 'ProjectForm.tsx.backup');
const targetPath = path.join('components', 'admin', 'ProjectForm.tsx');

try {
    let content = fs.readFileSync(backupPath, 'utf8');

    // 1. Remove orphaned attributes
    // We use a regex that matches the specific lines including newlines
    const orphans = `                                    value={formData.completion_percentage}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />\r\n`;

    // Try with \r\n (Windows) and \n (Unix)
    if (content.includes(orphans)) {
        content = content.replace(orphans, '');
        console.log("Removed orphans (Windows line endings)");
    } else {
        const orphansUnix = orphans.replace(/\r\n/g, '\n');
        if (content.includes(orphansUnix)) {
            content = content.replace(orphansUnix, '');
            console.log("Removed orphans (Unix line endings)");
        } else {
            console.log("WARNING: Could not find orphans block exactly. Trying loose regex.");
            content = content.replace(/value={formData\.completion_percentage}[\s\S]*?\/>\s*/, '');
        }
    }

    // 2. Fix Builder Section Closing
    // Target:
    //                                 </div>
    // 
    //                 </div>

    // Replacement:
    //                                 </div>
    //                             )}
    //                         </div>
    //                     </div>
    //                 </div>

    const builderTarget = `                                </div>

                </div>`;

    const builderReplacement = `                                </div>
                            )}
                        </div>
                    </div>
                </div>`;

    // Normalize line endings for matching
    const contentNormalized = content.replace(/\r\n/g, '\n');
    const targetNormalized = builderTarget.replace(/\r\n/g, '\n');

    if (contentNormalized.includes(targetNormalized)) {
        // We need to replace in the original content, so we need to be careful.
        // Let's just work with the normalized content and write that out (it's fine).
        content = contentNormalized.replace(targetNormalized, builderReplacement);
        console.log("Applied Builder Section Fix");
    } else {
        console.log("WARNING: Could not find Builder Section target");
        // Debug: print what we have around that area
        const index = contentNormalized.indexOf('                                </div>');
        if (index !== -1) {
            console.log("Found closing div at index " + index);
            console.log("Context:", contentNormalized.substring(index, index + 100));
        }
    }

    // 3. Add closing div for Basic Info before Image Uploads
    const imageUploadsHeader = `{/* Image Uploads - REDESIGNED */}`;
    if (content.includes(imageUploadsHeader)) {
        content = content.replace(imageUploadsHeader, `</div>\n\n                        ${imageUploadsHeader}`);
        console.log("Applied Basic Info Closing Fix");
    } else {
        console.log("WARNING: Could not find Image Uploads header");
    }

    // 4. Fix Malformed Tags at the end
    content = content.replace(/<\/div >/g, '</div>');
    content = content.replace(/< div className="pt-4" >/g, '<div className="pt-4">');
    content = content.replace(/<\/form >/g, '</form>');

    fs.writeFileSync(targetPath, content, 'utf8');
    console.log("Successfully wrote fixed ProjectForm.tsx");

} catch (err) {
    console.error("Error:", err);
}
